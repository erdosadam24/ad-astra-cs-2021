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
			return new OkResult();
		}

		[Authorize]
		[HttpGet("download")]
		public CaffFile downloadFile([FromQuery] string fileId)
		{
			return new CaffFile();
		}

		[Authorize]
		[HttpDelete("delete")]
		public ActionResult deleteFile([FromQuery] string FileID)
		{
			return new OkResult();
		}

		[HttpGet("allfiles")]
		public List<CaffFile> getAllFiles()
		{
			return new List<CaffFile>();
		}

		[Authorize]
		[HttpGet("userfiles")]
		public List<CaffFile> getUserFiles()
		{
			return new List<CaffFile>();
		}

		[Authorize]
		[HttpPost("addcomment")]
		public ActionResult addComment([FromBody] AddCommentRequest request)
		{
			return new OkResult();
		}

		[Authorize]
		[HttpPost("deleteUser")]
		public async Task<ActionResult> deleteUser([FromQuery] string UserId)
		{
			var user = await userManager.GetUserAsync(User);
			await userManager.DeleteAsync(user);
			await dbContext.SaveChangesAsync();
			return new OkResult();
		}

		[HttpGet("dbtest")]
		public void test()
		{
			var db =DatabaseService.createDatabase();
			DatabaseService.addFile(db, "testfile", "testID", "testData");
		}


	}
}
