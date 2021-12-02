using CAFF_Store.Data;
using CAFF_Store.Models;
using CAFF_Store.Models.Requests;
using CAFF_Store.Models.Responses;
using CAFF_Store.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Buffers.Text;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CAFF_Store.Controllers
{
	[Route("api/files")]
	[ApiController]
	public class FileController : ControllerBase
	{
		private readonly ApplicationDbContext dbContext;
		private readonly UserManager<ApplicationUser> userManager;
		private readonly RoleManager<IdentityRole> roleManager;

		public FileController(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
		{
			this.dbContext = dbContext;
			this.userManager = userManager;
			this.roleManager = roleManager;
		}

		[Authorize]
		[HttpPost("upload")]
		public ActionResult uploadFile([FromBody] CaffFile caffFile)
		{			
			byte[] backToBytes = Convert.FromBase64String(caffFile.Data.Substring(37)); //"data:application/octet-stream;base64," az elején
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			var userName = dbContext.Users.FirstOrDefault(u => u.Id == userId).UserName;
			var result = DatabaseService.UploadFileForUser(userId, caffFile.FileName, backToBytes);
			if (result == null) return BadRequest("File parsing failed");
			return new OkResult();
		}

		[Authorize]
		[HttpPut("modify")]
		public async Task<ActionResult> modifyFile([FromBody] CaffFile caffFile, [FromQuery] string userName, string fileName)
		{
			var currentId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			var currentUser = await userManager.FindByIdAsync(currentId);
			var fileData = DatabaseService.DownloadFile(currentId, fileName);
			if ((currentUser.UserName != userName) && !await userManager.IsInRoleAsync(currentUser, "admin")) {
				return new UnauthorizedResult();
			}

			var user = await userManager.FindByNameAsync(userName);

			DatabaseService.DeleteFile(user.Id, fileName);
			dbContext.Comments.RemoveRange(dbContext.Comments.Where(c => c.UserId == user.Id && c.FileName == fileName).ToArray());
			dbContext.SaveChanges();

			byte[] backToBytes = Convert.FromBase64String(caffFile.Data.Substring(37)); //"data:application/octet-stream;base64," az elején
			var result = DatabaseService.UploadFileForUser(user.Id, caffFile.FileName, backToBytes);
			if (result == null) return BadRequest("File parsing failed");
			return new OkResult();
		}

		[HttpGet("preview")]
		public ActionResult<CaffFile> getPreview([FromQuery] string userName, string fileName)
		{
			var userId = dbContext.Users.FirstOrDefault(u => u.UserName == userName)?.Id;
			if (userId == null) return BadRequest("No user found with this userName");
			var coverData = DatabaseService.DownloadFile(userId, fileName.Replace(".caff", ".bmp"));
			if (coverData == null) return BadRequest("File not found");
			var caffFile = new CaffFile
			{
				UserId = userId,
				FileName = fileName,
				Cover = Convert.ToBase64String(coverData),
				Author = userName,
				Created = DatabaseService.getFileCreatedDate(userId, fileName)
			};

			caffFile.Comments = dbContext.Comments.Where(c => c.UserId == caffFile.UserId && c.FileName == caffFile.FileName).ToList();
			return caffFile;
		}

		[Authorize]
		[HttpGet("download")]
		public ActionResult<CaffFile> downloadFile([FromQuery] string userName, string fileName)
		{
			var userId = dbContext.Users.FirstOrDefault(u => u.UserName == userName)?.Id;
			if (userId == null) return BadRequest("No user found with this userName");
			var fileData = DatabaseService.DownloadFile(userId, fileName);
			if(fileData == null)
			{
				return BadRequest("File was not found");
			}
			//var coverData = DatabaseService.DownloadFile(userId, fileName.Replace(".caff", ".bmp"));
			return new CaffFile
			{
				UserId = userId,
				FileName = fileName,
				Data = Convert.ToBase64String(fileData),
				//Cover = Convert.ToBase64String(coverData),
				Author = userName
			};
		}

		[Authorize]
		[HttpDelete("delete")]
		public async Task<ActionResult> deleteFile([FromQuery] string userName, string fileName)
		{
			var currentId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			var currentUser = await userManager.FindByIdAsync(currentId);

			var userId = dbContext.Users.FirstOrDefault(u => u.UserName == userName)?.Id;
			if (userId == null) return BadRequest("No user found with this userName");

			//var fileData = DatabaseService.DownloadFile(userId, fileName);
			if ((currentUser.UserName != userName) && !await userManager.IsInRoleAsync(currentUser, "admin"))
			{
				return new UnauthorizedResult();
			}

			var result = DatabaseService.DeleteFile(userId, fileName);
			if (!result) return BadRequest("file was not found");
			dbContext.Comments.RemoveRange(dbContext.Comments.Where(c => c.UserId == userId && c.FileName == fileName).ToArray());
			dbContext.SaveChanges();
			return new OkResult();
		}


		[HttpPost("allfiles")]
		public PagedCaffFiles getAllFiles([FromBody] GetAllFilesRequest request)
		{
			var page = DatabaseService.GetAllFiles(request);
			foreach(var file in page.Files)
			{
				file.Author = dbContext.Users.FirstOrDefault(u => u.Id == file.UserId).UserName;
				file.Created = DatabaseService.getFileCreatedDate(file.UserId, file.FileName);
				file.Comments = dbContext.Comments.Where(c => c.UserId == file.UserId && c.FileName == file.FileName).ToList();
			}
			return page;
		}


		[Authorize]
		[HttpPost("userfiles")]
		public PagedCaffFiles getUserFiles([FromBody] GetAllFilesRequest request)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			var userName = dbContext.Users.FirstOrDefault(u => u.Id == userId).UserName;
			var page = DatabaseService.GetUserFiles(userId,request);
			foreach (var file in page.Files)
			{
				file.Author = userName;
				file.Created = DatabaseService.getFileCreatedDate(file.UserId, file.FileName);
				file.Comments = dbContext.Comments.Where(c => c.UserId == userId && c.FileName == file.FileName).ToList();
			}
			return page;
		}


		[Authorize]
		[HttpPost("addcomment")]
		public async Task<ActionResult> addComment([FromBody] AddCommentRequest request)
		{
			var user = await userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));

			dbContext.Comments.Add(new Comment
			{
				UserId = user.Id,
				Author = user.UserName,
				Body = request.Body,
				FileName = request.FileName,
				Created = DateTime.Now
			});
			
			await dbContext.SaveChangesAsync();
			return new OkResult();
		}

		[Authorize]
		[HttpDelete("removeComment")]
		public async Task<ActionResult> removeComment([FromQuery] int commentID)
		{
			var currentUser = await userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));
			if (!await userManager.IsInRoleAsync(currentUser, "admin"))
			{
				return new UnauthorizedResult();
			}
			var deletedComment = await dbContext.Comments.FirstOrDefaultAsync(c => c.CommentId == commentID);
			if(deletedComment!= null)
			{
				dbContext.Comments.Remove(deletedComment);
				await dbContext.SaveChangesAsync();
			}
			return new OkResult();
		}

		[Authorize]
		[HttpPost("deleteUser")]
		public async Task<ActionResult> deleteUser([FromQuery] string userName)
		{
			var currentUser = await userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));
			if(!await userManager.IsInRoleAsync(currentUser, "admin"))
			{
				return new UnauthorizedResult();
			}

			var user = await userManager.FindByNameAsync(userName);

			var result = DatabaseService.DeleteUserDirectory(user.Id);
			if (!result) return BadRequest("User folder was not found");
			var deletedUser = await userManager.FindByIdAsync(user.Id);
			await userManager.DeleteAsync(deletedUser);
			dbContext.Comments.RemoveRange(dbContext.Comments.Where(c => c.UserId == user.Id).ToArray());
			await dbContext.SaveChangesAsync();
			return new OkResult();
		}

		[Authorize]
		[HttpPost("grantAdmin")]
		public async Task<ActionResult> grantAdmin([FromQuery] string userName)
		{
			var currentUser = await userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));
			if (!await userManager.IsInRoleAsync(currentUser, "admin"))
			{
				return new UnauthorizedResult();
			}
			var selectedUser = await userManager.FindByNameAsync(userName);
			await userManager.AddToRoleAsync(selectedUser, "admin");
			return new OkResult();
		}

		[Authorize]
		[HttpGet("userinfo")]
		public async Task<UserInfoResponse> getUserInfo()
		{
			var user = await userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));
			var roles = (await userManager.GetRolesAsync(user)).ToList();
			return new UserInfoResponse
			{
				UserName = user.UserName,
				Email = user.Email,
				Roles = roles
			};
		}
	}
}
