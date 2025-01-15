CREATE TABLE `transaction` (
	`id` text PRIMARY KEY NOT NULL,
	`vnpay_id` text NOT NULL,
	`secure_hash` text NOT NULL,
	`amount` integer NOT NULL,
	`status` integer DEFAULT 0 NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `transaction_vnpay_id_unique` ON `transaction` (`vnpay_id`);