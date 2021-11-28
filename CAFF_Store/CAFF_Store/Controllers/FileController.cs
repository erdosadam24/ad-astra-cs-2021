using CAFF_Store.Data;
using CAFF_Store.Models.Requests;
using CAFF_Store.Models.Responses;
using CAFF_Store.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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

		public FileController(ApplicationDbContext dbContext)
		{
			this.dbContext = dbContext;
		}

		[Authorize]
		[HttpPost("upload")]
		public UploadResponse uploadFile(UploadRequest request)
		{
			return new UploadResponse();
		}

		[Authorize]
		[HttpGet("download")]
		public DownloadResponse downloadFile(DownloadRequest request)
		{
			return new DownloadResponse();
		}

		[Authorize]
		[HttpDelete("delete")]
		public DeleteFileResponse deleteFile(DeleteFileRequest request)
		{
			return new DeleteFileResponse();
		}

		[HttpGet("allfiles")]
		public GetAllFilesResposne getAllFiles()
		{
			return new GetAllFilesResposne();
		}

		[Authorize]
		[HttpPost("addcomment")]
		public AddCommentResponse addComment(AddCommentRequest request)
		{
			return new AddCommentResponse();
		}

		[Authorize]
		[HttpPost("deleteUser")]
		public DeleteUserResponse deleteUser(DeleteUserRequest request)
		{
			return new DeleteUserResponse();
		}


	}
}
