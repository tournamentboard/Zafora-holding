ALTER TABLE "projects" ADD CONSTRAINT "projects_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_title_unique" UNIQUE("title");--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "content_stats" ADD CONSTRAINT "content_stats_label_unique" UNIQUE("label");--> statement-breakpoint
ALTER TABLE "methodology_steps" ADD CONSTRAINT "methodology_steps_step_number_unique" UNIQUE("step_number");--> statement-breakpoint
ALTER TABLE "faqs" ADD CONSTRAINT "faqs_question_unique" UNIQUE("question");