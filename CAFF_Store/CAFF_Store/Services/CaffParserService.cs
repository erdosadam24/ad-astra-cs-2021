using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;

namespace CAFF_Store.Services
{
	public class CaffParserService
	{

		[DllImport(@"..\..\..\..\Debug\DAL.dll", CallingConvention = CallingConvention.Cdecl)]
		static public extern IntPtr createCaff(string caffPath);

		[DllImport(@"..\..\..\..\Debug\DAL.dll", CallingConvention = CallingConvention.Cdecl)]
		static public extern string getCaffAsBmp(IntPtr pObject, string path, int ciff_number = 0);
	}
}
