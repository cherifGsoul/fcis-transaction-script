CREATE TABLE `answer_options` (
	`id` text PRIMARY KEY NOT NULL,
	`answer` text NOT NULL,
	`correct` integer NOT NULL,
	`question_id` text NOT NULL,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` text PRIMARY KEY NOT NULL,
	`prompt` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `answer_options_answer_unique` ON `answer_options` (`answer`);--> statement-breakpoint
CREATE INDEX `answer_idx` ON `answer_options` (`answer`);--> statement-breakpoint
CREATE UNIQUE INDEX `questions_prompt_unique` ON `questions` (`prompt`);--> statement-breakpoint
CREATE INDEX `prompt_idx` ON `questions` (`prompt`);