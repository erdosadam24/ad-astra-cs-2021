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
			DatabaseService.UploadFileForUser(User.FindFirstValue(ClaimTypes.NameIdentifier), caffFile.FileName, backToBytes);
			return new OkResult();
		}

		//TODO: Modify file

		[HttpGet("preview")]
		public CaffFile getPreview([FromQuery] string userId, string fileName)
		{
			var userName = dbContext.Users.FirstOrDefault(u => u.Id == userId).UserName;
			var coverData = DatabaseService.DownloadFile(userId, fileName.Replace(".caff", ".bmp"));
			var caffFile = new CaffFile
			{
				FileName = fileName,
				Cover = Convert.ToBase64String(coverData),
				Author = userName,
				UserID = userId
			};

			caffFile.Comments = dbContext.Comments.Where(c => c.UserID == caffFile.UserID && c.FileName == caffFile.FileName).ToList();
			return caffFile;
		}

		[Authorize]
		[HttpGet("download")]
		public async Task<CaffFile> downloadFile([FromQuery] string userId, string fileName)
		{
			var userName = dbContext.Users.FirstOrDefault(u => u.Id == userId).UserName;
			var fileData = DatabaseService.DownloadFile(userId, fileName);
			//var coverData = DatabaseService.DownloadFile(userId, fileName.Replace(".caff", ".bmp"));
			return new CaffFile
			{
				FileName = fileName,
				Data = Convert.ToBase64String(fileData),
				//Cover = Convert.ToBase64String(coverData),
				Author = userName,
				UserID = userId
			};
		}

		// Csak saját fájlt lehet törölni
		[Authorize]
		[HttpDelete("delete")]
		public ActionResult deleteFile([FromQuery] string fileName)
		{
			DatabaseService.DeleteFile(User.FindFirstValue(ClaimTypes.NameIdentifier), fileName);
			dbContext.Comments.RemoveRange(dbContext.Comments.Where(c => c.UserID == User.FindFirstValue(ClaimTypes.NameIdentifier) && c.FileName == fileName).ToArray());
			dbContext.SaveChanges();
			return new OkResult();
		}


		[HttpPost("allfiles")]
		public PagedCaffFiles getAllFiles([FromBody] GetAllFilesRequest request)
		{
			var page = DatabaseService.GetAllFiles(request);
			foreach(var file in page.Files)
			{
				file.Comments = dbContext.Comments.Where(c => c.UserID == file.UserID && c.FileName == file.FileName).ToList();
			}
			return page;
		}


		[Authorize]
		[HttpPost("userfiles")]
		public PagedCaffFiles getUserFiles([FromBody] GetAllFilesRequest request)
		{
			var page = DatabaseService.GetUserFiles(User.FindFirstValue(ClaimTypes.NameIdentifier),request);
			foreach (var file in page.Files)
			{
				file.Comments = dbContext.Comments.Where(c => c.UserID == file.UserID && c.FileName == file.FileName).ToList();
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
				UserID = user.Id,
				Author = user.UserName,
				Body = request.Body,
				FileName = request.FileName
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
		public async Task<ActionResult> deleteUser([FromQuery] string UserId)
		{
			var currentUser = await userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));
			if(!await userManager.IsInRoleAsync(currentUser, "admin"))
			{
				return new UnauthorizedResult();
			}
			var deletedUser = await userManager.FindByIdAsync(UserId);
			await userManager.DeleteAsync(deletedUser);
			await dbContext.SaveChangesAsync();
			return new OkResult();
		}
		[Authorize]
		[HttpPost("grantAdmin")]
		public async Task<ActionResult> grantAdmin([FromQuery] string userId)
		{
			var currentUser = await userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));
			if (!await userManager.IsInRoleAsync(currentUser, "admin"))
			{
				return new UnauthorizedResult();
			}
			var selectedUser = await userManager.FindByIdAsync(userId);
			await userManager.AddToRoleAsync(selectedUser, "admin");
			return new OkResult();
		}

	}
}
