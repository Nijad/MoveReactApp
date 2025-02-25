using Microsoft.Win32.SafeHandles;
using System.Runtime.InteropServices;
using System.Security.Principal;

namespace eDocBrowser.Services
{
    public class ImpersonationService : IImpersonationService
    {
        [DllImport("advapi32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
        public static extern bool LogonUser(String lpszUsername, String lpszDomain, String lpszPassword,
       int dwLogonType, int dwLogonProvider, out SafeAccessTokenHandle phToken);

        private const int LOGON32_PROVIDER_DEFAULT = 0;

        private const int LOGON32_LOGON_INTERACTIVE = 2;       

        public void RunImpersonated(string userName, string domainName, string password, Action action)
        {
            SafeAccessTokenHandle safeAccessTokenHandle;
            
            bool returnValue = LogonUser(userName, domainName, password,
                LOGON32_LOGON_INTERACTIVE, LOGON32_PROVIDER_DEFAULT,
                out safeAccessTokenHandle);


            if (false == returnValue)
            {
                int ret = Marshal.GetLastWin32Error();
                throw new System.ComponentModel.Win32Exception(ret);
            }

            WindowsIdentity.RunImpersonated(safeAccessTokenHandle, action);                
        }

        //===============================================================================================================================================
        public async Task RunImpersonatedAsync(string userName, string domainName, string password, Func<Task> action)
        {
            SafeAccessTokenHandle safeAccessTokenHandle;

            bool returnValue = LogonUser(userName, domainName, password,
                LOGON32_LOGON_INTERACTIVE, LOGON32_PROVIDER_DEFAULT,
                out safeAccessTokenHandle);


            if (false == returnValue)
            {
                int ret = Marshal.GetLastWin32Error();
                throw new System.ComponentModel.Win32Exception(ret);
            }

            await WindowsIdentity.RunImpersonatedAsync(safeAccessTokenHandle, action);
        }

      
    }
}
