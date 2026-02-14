import { Module } from '@nestjs/common';
import { FeedbackModule } from './feedback/feedback.module';
import { ProjectsModule } from './projects/projects.module';
import { SupabaseModule } from './supabase/supabase.module';
import { HealthController } from './health.controller';
import { AppController } from './app.controller';

@Module({
  imports: [SupabaseModule, FeedbackModule, ProjectsModule],
  controllers: [AppController, HealthController],
})
export class AppModule {}
