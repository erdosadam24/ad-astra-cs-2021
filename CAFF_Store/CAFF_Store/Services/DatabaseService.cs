using CAFF_Store.Models;
using CAFF_Store.Models.Requests;
using CAFF_Store.Models.Responses;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace CAFF_Store.Services
{
    public class DatabaseService
    {

		public static void TestExe (){
			
			Process.Start("parser.exe", @"caff_files\1.caff");
		}
		public static void CreateDirectoryForUser(string userID)
		{
			Directory.CreateDirectory(Path.Combine("caff_files", userID));
		}
		public static string GetUserFolderPath(string userID)
		{
			return Path.Combine("caff_files", userID);
		}

		public static string UploadFileForUser(string userID, string fileName, byte[] data)
		{
			string path = Path.Combine(GetUserFolderPath(userID),fileName);
			File.WriteAllBytes(path, data);
			CaffParserService.createBmpForCaffFile(path);
			return path;
		}

		public static byte[] DownloadFile(string userID, string fileName)
		{
			string path = Path.Combine(GetUserFolderPath(userID), fileName);
			byte[] fileData = File.ReadAllBytes(path);
			return fileData;
		}

		public static void DeleteFile(string userID, string fileName)
		{
			var caffName = fileName.Replace(".bmp", ".caff");
			string bmpPath = Path.Combine(GetUserFolderPath(userID), fileName);
			string caffPath = Path.Combine(GetUserFolderPath(userID), caffName);

			File.Delete(bmpPath);
			File.Delete(caffPath);
		}

		public static PagedCaffFiles GetAllFiles(GetAllFilesRequest request)
		{
			var result = new List<CaffFile>();
			var totalElements = 0;
			foreach(var userDir in Directory.GetDirectories("caff_files"))
			{
				string userID = Path.GetFileName(userDir);
				
				var bmpFiles = Directory.GetFiles(userDir)
					.Where(fn => fn.EndsWith(".bmp") && fn.ToUpper().Contains(request.NameFilter.ToUpper()))
					.Select(fn => new FileInfo(fn))
					.OrderBy(f =>f.CreationTime)
					.Skip((request.PageNumber-1)*request.PageSize)
					.Take(request.PageSize)
					.ToList();
				totalElements += Directory.GetFiles(userDir)
					.Where(fn => fn.EndsWith(".bmp") && fn.ToUpper().Contains(request.NameFilter.ToUpper())).Count();

				foreach (var file in bmpFiles)
				{
					var fileName = Path.GetFileName(file.Name);
					byte[] fileData = File.ReadAllBytes(file.FullName);		
					result.Add(new CaffFile
					{
						UserID = userID,
						FileName = fileName,
						Data = Convert.ToBase64String(fileData)
					});

				}
			}

			var page = new PagedCaffFiles();
			page.Files = result;
			page.TotalSize = totalElements;

			return page;
		}

		public static PagedCaffFiles GetUserFiles(string userID, GetAllFilesRequest request)
		{
			var result = new List<CaffFile>();
			var userDir = Path.Combine("caff_files", userID);
			var bmpFiles = Directory.GetFiles(userDir)
					.Where(fn => fn.EndsWith(".bmp") && fn.ToUpper().Contains(request.NameFilter.ToUpper()))
					.Select(fn => new FileInfo(fn))
					.OrderBy(f => f.CreationTime)
					.Skip((request.PageNumber - 1) * request.PageSize)
					.Take(request.PageSize)
					.ToList();
			var totalElements = Directory.GetFiles(userDir)
					.Where(fn => fn.EndsWith(".bmp") && fn.ToUpper().Contains(request.NameFilter.ToUpper())).Count();
			foreach (var file in bmpFiles)
			{
				var fileName = Path.GetFileName(file.Name);
				byte[] fileData = File.ReadAllBytes(file.FullName);
				result.Add(new CaffFile
				{
					UserID = userID,
					FileName = fileName,
					Data = Convert.ToBase64String(fileData)
				});

			}

			var page = new PagedCaffFiles();
			page.Files = result;
			page.TotalSize = totalElements;

			return page;
		}
	}

		
    
}

