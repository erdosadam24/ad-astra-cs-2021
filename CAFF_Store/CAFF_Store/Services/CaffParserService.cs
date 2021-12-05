using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;

namespace CAFF_Store.Services
{
	public class CaffParserService
	{
		public static bool createBmpForCaffFile(string caffPath)
		{
			ProcessStartInfo processStartInfo = new ProcessStartInfo(@"parser.exe", caffPath);
			processStartInfo.RedirectStandardError = true;
            Process proc = new Process
            {
				StartInfo = processStartInfo
            };
            proc.Start();
			proc.WaitForExit();
			if (proc.ExitCode == 0)
            {
				return true;
			} else
            {
				StreamReader reader = proc.StandardError;
				Console.WriteLine(reader.ReadLine());
				return false;
            }
		}
	}
}
