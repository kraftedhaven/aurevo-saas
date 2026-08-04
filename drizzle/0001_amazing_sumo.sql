CREATE TABLE `callConsoleSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`calls` int DEFAULT 0,
	`ticket` int DEFAULT 0,
	`close` int DEFAULT 100,
	`weeks` int DEFAULT 4,
	`setup` int DEFAULT 0,
	`retainer` int DEFAULT 0,
	`cost` int DEFAULT 0,
	`buildcost` int DEFAULT 0,
	`newclients` int DEFAULT 0,
	`runningclients` int DEFAULT 0,
	`numbersHidden` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `callConsoleSettings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `objectionResponses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`objection` text NOT NULL,
	`response` text NOT NULL,
	`trade` varchar(256),
	`painPoint` varchar(256),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `objectionResponses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trackerEntries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`date` varchar(256) NOT NULL,
	`client` varchar(256) NOT NULL,
	`note` text,
	`value` int DEFAULT 0,
	`flag` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `trackerEntries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tradeBenchmarks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`trade` varchar(256) NOT NULL,
	`avgCalls` int DEFAULT 0,
	`avgTicket` int DEFAULT 0,
	`avgClose` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tradeBenchmarks_id` PRIMARY KEY(`id`),
	CONSTRAINT `tradeBenchmarks_trade_unique` UNIQUE(`trade`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `businessId` varchar(64);--> statement-breakpoint
ALTER TABLE `callConsoleSettings` ADD CONSTRAINT `callConsoleSettings_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `trackerEntries` ADD CONSTRAINT `trackerEntries_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;