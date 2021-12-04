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
using Microsoft.Extensions.Logging;
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
		private readonly ILogger logger;

		public FileController(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, ILogger logger)
		{
			this.dbContext = dbContext;
			this.userManager = userManager;
			this.roleManager = roleManager;
			this.logger = logger;
		}

		[Authorize]
		[HttpPost("upload")]
		public ActionResult uploadFile([FromBody] CaffFile caffFile)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			byte[] backToBytes = Array.Empty<byte>();
			try
            {
				backToBytes = Convert.FromBase64String(caffFile.Data.Substring(37)); //"data:application/octet-stream;base64," az elején
			} catch
            {
				logger.LogError($"User: {userId} called upload. File parsing failed.");
				return BadRequest("File parsing failed");
            }			
			var userName = dbContext.Users.FirstOrDefault(u => u.Id == userId).UserName;
			var result = DatabaseService.UploadFileForUser(userId, caffFile.FileName, backToBytes);
			if (result == null) return BadRequest("File parsing failed");
			logger.LogInformation($"User: {userId} called upload. Upload successful. File name: {caffFile.FileName}, Author: {caffFile.Author}, Creation time: {caffFile.Created}");
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
				logger.LogError($"Unauthorized User: {currentId} tried modifying {userName}'s {fileName} file without admin privilages.");
				return new UnauthorizedResult();
			}

			var user = await userManager.FindByNameAsync(userName);

			DatabaseService.DeleteFile(user.Id, fileName);
			dbContext.Comments.RemoveRange(dbContext.Comments.Where(c => c.FileOwnerUserId == user.Id && c.FileName == fileName).ToArray());
			dbContext.SaveChanges();

			byte[] backToBytes = Array.Empty<byte>();
			try
			{
				backToBytes = Convert.FromBase64String(caffFile.Data.Substring(37)); //"data:application/octet-stream;base64," az elején
			}
			catch
			{
				logger.LogError($"User: {currentId} called modify on {userName}'s {fileName} file. File parsing failed.");
				return BadRequest("File parsing failed");
			}
			var result = DatabaseService.UploadFileForUser(user.Id, caffFile.FileName, backToBytes);
			if (result == null)
			{
				logger.LogError($"User: {currentId} called modify on {userName}'s {fileName} file. File parsing failed.");
				return BadRequest("File parsing failed");
			}
			logger.LogInformation($"Authorized User: {currentId} modified {userName}'s {fileName} file.");
			return new OkResult();
		}

		[HttpGet("preview")]
		public ActionResult<CaffFile> getPreview([FromQuery] string userName, string fileName)
		{
			var userId = dbContext.Users.FirstOrDefault(u => u.UserName == userName)?.Id;
			if (userId == null)
			{
				logger.LogError($"Unsuccessful preview call, username {userName} not found.");
				return BadRequest("No user found with this userName");
			}
			var coverData = DatabaseService.DownloadFile(userId, fileName.Replace(".caff", ".bmp"));
			if (coverData == null)
			{
				logger.LogError($"Unsuccessful preview call, file {fileName} for {userName} not found.");
				return BadRequest("File not found");
			}
			var caffFile = new CaffFile
			{
				UserId = userId,
				FileName = fileName,
				Cover = Convert.ToBase64String(coverData),
				Author = userName,
				Created = DatabaseService.getFileCreatedDate(userId, fileName)
			};

			caffFile.Comments = dbContext.Comments.Where(c => c.FileOwnerUserId == caffFile.UserId && c.FileName == caffFile.FileName).ToList();
			logger.LogInformation($"Successful preview call on file {fileName}");
			return caffFile;
		}

		[Authorize]
		[HttpGet("download")]
		public ActionResult<CaffFile> downloadFile([FromQuery] string userName, string fileName)
		{
			var userId = dbContext.Users.FirstOrDefault(u => u.UserName == userName)?.Id;
			if (userId == null)
			{
				logger.LogError($"Unsuccessful download call, username {userName} not found.");
				return BadRequest("No user found with this userName");
			}
			var fileData = DatabaseService.DownloadFile(userId, fileName);
			if(fileData == null)
			{
				logger.LogError($"Unsuccessful download call, file {fileName} for {userName} not found.");
				return BadRequest("File was not found");
			}
			logger.LogInformation($"File {fileName} successfully downloaded by {User.FindFirstValue(ClaimTypes.NameIdentifier)}");
			return new CaffFile
			{
				UserId = userId,
				FileName = fileName,
				Data = Convert.ToBase64String(fileData),
				Created = DatabaseService.getFileCreatedDate(userId, fileName),
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
			if (userId == null)
			{
				logger.LogError($"Unsuccessful delete call, user {userName} not found");
				return BadRequest("No user found with this userName");
			}

			if ((currentUser.UserName != userName) && !await userManager.IsInRoleAsync(currentUser, "admin"))
			{
				logger.LogError($"Unauthorized User: {currentId} tried deleting {userName}'s {fileName} file without admin privilages.");
				return new UnauthorizedResult();
			}

			var result = DatabaseService.DeleteFile(userId, fileName);
			if (!result)
			{
				logger.LogError($"Unsuccessful delete call, file {fileName} not found");
				return BadRequest("file was not found");
			}
			dbContext.Comments.RemoveRange(dbContext.Comments.Where(c => c.FileOwnerUserId == userId && c.FileName == fileName).ToArray());
			dbContext.SaveChanges();
			logger.LogInformation($"Authorized User: {currentId} deleted {userName}'s {fileName} file.");
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
				file.Comments = dbContext.Comments.Where(c => c.FileOwnerUserId == file.UserId && c.FileName == file.FileName).ToList();
			}
			logger.LogInformation($"GetAllFiles called.");
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
				file.Comments = dbContext.Comments.Where(c => c.FileOwnerUserId == file.UserId && c.FileName == file.FileName).ToList();
			}
			logger.LogInformation($"GetUserFiles called.");
			return page;
		}


		[Authorize]
		[HttpPost("addcomment")]
		public async Task<ActionResult> addComment([FromBody] AddCommentRequest request)
		{
			var user = await userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));
			var owner = await userManager.FindByNameAsync(request.FileOwnerUserName);

			dbContext.Comments.Add(new Comment
			{
				UserId = user.Id,
				Author = user.UserName,
				Body = request.Body,
				FileName = request.FileName,
				FileOwnerUserId = owner.Id,
				Created = DateTime.Now
			});
			
			await dbContext.SaveChangesAsync();
			logger.LogInformation($"New comment added to {request.FileOwnerUserName}'s {request.FileName} by {user.UserName}.");
			return new OkResult();
		}

		[Authorize]
		[HttpDelete("removeComment")]
		public async Task<ActionResult> removeComment([FromQuery] int commentID)
		{
			var currentUser = await userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));
			var comment = dbContext.Comments.FirstOrDefault(c => c.CommentId == commentID);
			if (!await userManager.IsInRoleAsync(currentUser, "admin") && comment.UserId != currentUser.Id)
			{
				logger.LogError($"Unauthorized User {currentUser.Id} tried deleteing comment with id {commentID} without admin privilages");
				return new UnauthorizedResult();
			}
			var deletedComment = await dbContext.Comments.FirstOrDefaultAsync(c => c.CommentId == commentID);
			if(deletedComment!= null)
			{
				dbContext.Comments.Remove(deletedComment);
				await dbContext.SaveChangesAsync();
			}
			logger.LogInformation($"removeComment on comment id {commentID} was called with admin privilages");
			return new OkResult();
		}

		[Authorize]
		[HttpPost("deleteUser")]
		public async Task<ActionResult> deleteUser([FromQuery] string userName)
		{
			var currentUser = await userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));
			if(!await userManager.IsInRoleAsync(currentUser, "admin"))
			{
				logger.LogError($"Unauthorized User: {currentUser.Id} tried deleting {userName}'s account without admin privilages.");
				return new UnauthorizedResult();
			}

			var user = await userManager.FindByNameAsync(userName);

			var result = DatabaseService.DeleteUserDirectory(user.Id);
			if (!result)
			{
				logger.LogError($"Delete user was called by admin but user {userName} was not found");
				return BadRequest("User folder was not found");
			}
			var deletedUser = await userManager.FindByIdAsync(user.Id);
			await userManager.DeleteAsync(deletedUser);
			dbContext.Comments.RemoveRange(dbContext.Comments.Where(c => c.UserId == user.Id).ToArray());
			await dbContext.SaveChangesAsync();
			logger.LogInformation($"User {userName} was deleted");
			return new OkResult();
		}

		[Authorize]
		[HttpPost("grantAdmin")]
		public async Task<ActionResult> grantAdmin([FromQuery] string userName)
		{
			var currentUser = await userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));
			if (!await userManager.IsInRoleAsync(currentUser, "admin"))
			{
				logger.LogError($"Unauthorized User: {currentUser.Id} tried granting admin to {userName} without admin privilages.");
				return new UnauthorizedResult();
			}
			var selectedUser = await userManager.FindByNameAsync(userName);
			await userManager.AddToRoleAsync(selectedUser, "admin");
			logger.LogInformation($"{userName} was granted admin privilages");
			return new OkResult();
		}

		[Authorize]
		[HttpGet("userinfo")]
		public async Task<UserInfoResponse> getUserInfo()
		{
			var user = await userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));
			var roles = (await userManager.GetRolesAsync(user)).ToList();
			logger.LogInformation($"Userinfo was called by {user.UserName}, id: {user.Id}");
			return new UserInfoResponse
			{
				UserName = user.UserName,
				Email = user.Email,
				Roles = roles
			};
		}
	}
}
