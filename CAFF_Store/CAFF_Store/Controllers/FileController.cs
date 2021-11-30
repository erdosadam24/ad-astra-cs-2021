using CAFF_Store.Data;
using CAFF_Store.Models;
using CAFF_Store.Models.Requests;
using CAFF_Store.Models.Responses;
using CAFF_Store.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
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

		public FileController(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
		{
			this.dbContext = dbContext;
			this.userManager = userManager;
		}

		[Authorize]
		[HttpPost("upload")]
		public ActionResult uploadFile([FromBody] CaffFile caffFile)
		{
			var filePath = DatabaseService.UploadFileForUser(User.FindFirstValue(ClaimTypes.NameIdentifier), caffFile.FileName, caffFile.Data);
			CaffParserService.createBmpForCaffFile(filePath);
			return new OkResult();
		}

		[Authorize]
		[HttpGet("download")]
		public async Task<CaffFile> downloadFile([FromQuery] string fileName)
		{
			var user = await userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));
			var fileData = DatabaseService.DownloadFile(user.Id, fileName);
			return new CaffFile
			{
				FileName = fileName,
				Data = fileData,
				UserID = user.Id
			};
		}

		[Authorize]
		[HttpDelete("delete")]
		public ActionResult deleteFile([FromQuery] string fileName)
		{
			DatabaseService.DeleteFile(User.FindFirstValue(ClaimTypes.NameIdentifier), fileName);
			dbContext.Comments.RemoveRange(dbContext.Comments.Where(c => c.UserID == User.FindFirstValue(ClaimTypes.NameIdentifier) && c.FileName == fileName).ToArray());
			dbContext.SaveChanges();
			return new OkResult();
		}

		[HttpGet("allfiles")]
		public List<CaffFile> getAllFiles(GetAllFilesRequest request)
		{
			var files = DatabaseService.GetAllFiles(request);
			foreach(var file in files)
			{
				file.Comments = dbContext.Comments.Where(c => c.UserID == file.UserID && c.FileName == file.FileName).ToList();
			}
			return files;
		}

		[Authorize]
		[HttpGet("userfiles")]
		public List<CaffFile> getUserFiles()
		{
			var files = DatabaseService.GetUserFiles(User.FindFirstValue(ClaimTypes.NameIdentifier));
			foreach (var file in files)
			{
				file.Comments = dbContext.Comments.Where(c => c.UserID == file.UserID && c.FileName == file.FileName).ToList();
			}
			return files;
		}

		[Authorize]
		[HttpPost("addcomment")]
		public async Task<ActionResult> addComment([FromBody] AddCommentRequest request)
		{
			var user = await userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));

			dbContext.Comments.Add(new Comment
			{
				UserID = request.UserID,
				Username = user.Email,
				Text = request.Text,
				FileName = request.FileName
			});
			await dbContext.SaveChangesAsync();
			return new OkResult();
		}

		[Authorize]
		[HttpPost("deleteUser")]
		public async Task<ActionResult> deleteUser([FromQuery] string UserId)
		{
			var currentUser = await userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));
			var deletedUser = await userManager.FindByIdAsync(UserId);
			await userManager.DeleteAsync(deletedUser);
			await dbContext.SaveChangesAsync();
			return new OkResult();
		}



	}
}
