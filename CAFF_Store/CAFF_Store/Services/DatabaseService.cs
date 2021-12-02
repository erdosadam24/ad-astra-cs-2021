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
			string userFolder = GetUserFolderPath(userID);
			if (!Directory.Exists(userFolder))
            {
				Directory.CreateDirectory(userFolder);
            }
			string path = Path.Combine(userFolder,fileName);
			File.WriteAllBytes(path, data);
			var result = CaffParserService.createBmpForCaffFile(path);
			if (!result) return null;
			return path;
		}

		public static byte[] DownloadFile(string userID, string fileName)
		{
			string path = Path.Combine(GetUserFolderPath(userID), fileName);
			try
			{
				byte[] fileData = File.ReadAllBytes(path);
				return fileData;

			}
			catch(Exception e)
			{
				return null;
			}
			
			
		}

		public static bool DeleteFile(string userID, string fileName)
		{
			var bmpName = fileName.Replace(".caff", ".bmp");
			string bmpPath = Path.Combine(GetUserFolderPath(userID), bmpName);
			string caffPath = Path.Combine(GetUserFolderPath(userID), fileName);

			try {
				File.Delete(bmpPath);
				File.Delete(caffPath);
				return true;
			}
			catch (Exception e)
			{
				return false;
			}
		
		}

		public static bool DeleteUserDirectory(string userID)
		{
			var path = Path.Combine("caff_files", userID);
			try
			{
				DirectoryInfo di = new DirectoryInfo(path);

				foreach (FileInfo file in di.GetFiles())
				{
					file.Delete();
				}
				foreach (DirectoryInfo dir in di.GetDirectories())
				{
					dir.Delete(true);
				}
				return true;
			}
			catch(Exception e)
			{
				return false;
			}
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
					var fileName = Path.GetFileName(file.Name.Replace(".bmp", ".caff"));
					byte[] fileData = File.ReadAllBytes(file.FullName);		
					result.Add(new CaffFile
					{
						FileName = fileName,
						Cover = Convert.ToBase64String(fileData)
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
				var fileName = Path.GetFileName(file.Name.Replace(".bmp", ".caff"));
				byte[] fileData = File.ReadAllBytes(file.FullName);
				result.Add(new CaffFile
				{
					FileName = fileName,
					Data = Convert.ToBase64String(fileData)
				});

			}

			var page = new PagedCaffFiles();
			page.Files = result;
			page.TotalSize = totalElements;

			return page;
		}

		public static DateTime getFileCreatedDate(string userID, string fileName)
		{
			string path = Path.Combine(GetUserFolderPath(userID), fileName);
			try
			{
				DateTime created = File.GetCreationTime(path);
				return created;
			}
			catch (Exception e)
			{
				return DateTime.Parse("2000/01/01");
			}
		}
	}

		
    
}

