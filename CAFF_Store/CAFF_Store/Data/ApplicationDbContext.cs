using CAFF_Store.Models;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CAFF_Store.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }

		public DbSet<Comment> Comments { get; set; }

		protected override void OnModelCreating(ModelBuilder builder)
		{
			base.OnModelCreating(builder);

            builder.Entity<Comment>().HasKey(c => c.CommentId);

			builder.Entity<ApplicationUser>().Property(u => u.UserName).IsRequired();

			builder.Entity<ApplicationUser>().HasData(new ApplicationUser
			{
				Id = "b8774540-eec6-46b3-803a-413a38b9c386",
				UserName = "admin@email.com",
				NormalizedUserName = "ADMIN@EMAIL.COM",
				Email = "admin@email.com",
				NormalizedEmail = "ADMIN@EMAIL.COM",
				EmailConfirmed = false,
				PasswordHash = "AQAAAAEAACcQAAAAEO0w0uCrnzqnHAow/7wEpXbjFse51LaYsKSXyuH1N3A4waCxLpSSpnxTfK2OAJkGig==",
				SecurityStamp = "EO2N5S75T7KKJP4BQJ2FR3MDMCNLUJRZ",
				ConcurrencyStamp = "0e0a85bd-82cb-4d75-853e-42bb308c4d9b",
				PhoneNumberConfirmed = false,
				TwoFactorEnabled = false,
				LockoutEnabled = false,
				AccessFailedCount = 0

			});

			builder.Entity<IdentityRole>().HasData(new IdentityRole { 
				Id = "0abbc722-ab1b-4469-ade0-508566661c39",
				Name = "admin",
				NormalizedName = "ADMIN",
				ConcurrencyStamp = "2db6ab31-3b68-4441-ad58-fe0e6e592157"
			});

			builder.Entity<IdentityUserRole<string>>().HasData(new IdentityUserRole<string>
			{
				UserId = "b8774540-eec6-46b3-803a-413a38b9c386",
				RoleId = "0abbc722-ab1b-4469-ade0-508566661c39"
			});


		}
	}
}
