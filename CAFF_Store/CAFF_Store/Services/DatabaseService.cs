using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;

namespace CAFF_Store.Services
{
    public class DatabaseService
    {

		[DllImport(@"..\..\..\..\Debug\DAL.dll", CallingConvention = CallingConvention.Cdecl)]
		static public extern IntPtr createDatabase();

		[DllImport(@"..\..\..\..\Debug\DAL.dll", CallingConvention = CallingConvention.Cdecl)]
		static public extern void addFile(IntPtr pObject, string filename, string userid, string data);

        [DllImport(@"..\..\..\..\Debug\DAL.dll", CallingConvention = CallingConvention.Cdecl)]
        static public extern void deleteFile(IntPtr pObject, string filename, string userid);

        [DllImport(@"..\..\..\..\Debug\DAL.dll", CallingConvention = CallingConvention.Cdecl)]
        static public extern void getFile(IntPtr pObject, string filename, string userid);
    }
}

