using CAFF_Store.Data;
using CAFF_Store.Models;
using IdentityModel;
using IdentityServer4;
using IdentityServer4.Contrib.AspNetCore.Testing.Builder;
using IdentityServer4.Contrib.AspNetCore.Testing.Configuration;
using IdentityServer4.Contrib.AspNetCore.Testing.Services;
using IdentityServer4.EntityFramework.Options;
using IdentityServer4.Models;
using IdentityServer4.Validation;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Xunit;

namespace Tests
{

	public class TestPasswordValidator : IResourceOwnerPasswordValidator
	{
		public Task ValidateAsync(ResourceOwnerPasswordValidationContext context)
		{
            if (context.UserName != "user" || context.Password != "password")
            {
                context.Result =
                    new GrantValidationResult(TokenRequestErrors.InvalidRequest, "Username or password is wrong!");
                return Task.CompletedTask;
            }

            context.Result = new GrantValidationResult("user", OidcConstants.AuthenticationMethods.Password,
                new List<Claim>
                {
                    new Claim(JwtClaimTypes.Subject, "user")
                });

            return Task.CompletedTask;
        }
	}

    public class AuthenticationTests
	{
        private UserManager<ApplicationUser> userManager;
		private SignInManager<ApplicationUser> signInManager;

	
        public AuthenticationTests()
		{
            var userStore = new UserStore<ApplicationUser>(new IdentityDbContext<ApplicationUser>(new DbContextOptionsBuilder().UseInMemoryDatabase("testdb").Options));
            userManager = new UserManager<ApplicationUser>(userStore, null, new PasswordHasher<ApplicationUser>(), null, null, null, null, null, null);

        }

		[Fact]
		public async Task SuccesfulTokenRequestTestAsync()
		{
            var clientConfiguration = new ClientConfiguration("TestClientId", "TestClientSecret");

            var client = new Client
            {
                ClientId = clientConfiguration.Id,
                ClientSecrets = new List<Secret>
                {
                    new Secret(clientConfiguration.Secret.Sha256())
                },
                AllowedScopes = new[] { IdentityServerConstants.StandardScopes.OfflineAccess },
                AllowedGrantTypes = new[] { GrantType.ClientCredentials, GrantType.ResourceOwnerPassword },
                AccessTokenType = AccessTokenType.Jwt,
                AccessTokenLifetime = 7200,
                AllowOfflineAccess = true
            };

            var webHostBuilder = new IdentityServerTestWebHostBuilder()
                .AddClients(client)
                .AddApiResources(new ApiResource("api1", "api1name"))
                .UseResourceOwnerPasswordValidator(typeof(TestPasswordValidator))
                .CreateWebHostBuider();

            var identityServerProxy = new IdentityServerWebHostProxy(webHostBuilder);

            var tokenResponse = await identityServerProxy.GetResourceOwnerPasswordAccessTokenAsync(clientConfiguration,
                new UserLoginConfiguration("user", "password"), IdentityServerConstants.StandardScopes.OfflineAccess);

            Assert.NotNull(tokenResponse);
            Assert.False(tokenResponse.IsError, tokenResponse.Error ?? tokenResponse.ErrorDescription);
        }

        [Fact]
        public async Task UnsuccesfulTokenRequestTestAsync()
        {
            var clientConfiguration = new ClientConfiguration("TestClientId", "TestClientSecret");

            var client = new Client
            {
                ClientId = clientConfiguration.Id,
                ClientSecrets = new List<Secret>
                {
                    new Secret(clientConfiguration.Secret.Sha256())
                },
                AllowedScopes = new[] { "api1", IdentityServerConstants.StandardScopes.OfflineAccess },
                AllowedGrantTypes = new[] { GrantType.ClientCredentials, GrantType.ResourceOwnerPassword },
                AccessTokenType = AccessTokenType.Jwt,
                AccessTokenLifetime = 7200,
                AllowOfflineAccess = true
            };

            var webHostBuilder = new IdentityServerTestWebHostBuilder()
                .AddClients(client)
                .AddApiResources(new ApiResource("api1", "api1name"))
                .UseResourceOwnerPasswordValidator(typeof(TestPasswordValidator))
                .CreateWebHostBuider();

            var identityServerProxy = new IdentityServerWebHostProxy(webHostBuilder);

            var tokenResponse = await identityServerProxy.GetResourceOwnerPasswordAccessTokenAsync(clientConfiguration,
                new UserLoginConfiguration("user", "wrongPassword"),
                "api1", "offline_access");

            Assert.NotNull(tokenResponse);
            Assert.True(tokenResponse.IsError, tokenResponse.Error ?? tokenResponse.ErrorDescription);
        }
        [Fact]
        public async Task RegisterTest()
		{
            var user = new ApplicationUser
            {
                Email = "testemail@email.com",
                UserName = "testuser"
            };

            var result = await userManager.CreateAsync(user, "testpassword");

            Assert.NotNull(result);
            Assert.True(result.Succeeded);
            var registeredUser = await userManager.FindByEmailAsync("testemail@email.com");
            Assert.NotNull(registeredUser);
            Assert.True(registeredUser.UserName == "testuser");

		}        
    }
}
