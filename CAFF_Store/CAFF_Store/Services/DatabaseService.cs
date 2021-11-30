using CAFF_Store.Models;
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

		public static List<CaffFile> GetAllFiles()
		{
			var result = new List<CaffFile>();
			foreach(var userDir in Directory.GetDirectories("caff_files"))
			{
				string userID = Path.GetFileName(userDir);
				var bmpFiles = Directory.GetFiles(userDir).Where(fn => fn.EndsWith(".bmp")).ToList();
				foreach(var file in bmpFiles)
				{
					var fileName = Path.GetFileName(file);
					byte[] fileData = File.ReadAllBytes(file);		
					result.Add(new CaffFile
					{
						UserID = userID,
						FileName = fileName,
						Data = fileData
					});

				}
			}

			return result;
		}

		public static List<CaffFile> GetUserFiles(string userID)
		{
			var result = new List<CaffFile>();
			var userDir = Path.Combine("caff_files", userID);
			var bmpFiles = Directory.GetFiles(userDir).Where(fn => fn.EndsWith(".bmp")).ToList();
			foreach (var file in bmpFiles)
			{
				var fileName = Path.GetFileName(file);
				byte[] fileData = File.ReadAllBytes(file);
				result.Add(new CaffFile
				{
					UserID = userID,
					FileName = fileName,
					Data = fileData
				});

			}

			return result;
		}
	}

		
    
}

