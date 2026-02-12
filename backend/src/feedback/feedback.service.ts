import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  private readonly logger = new Logger(FeedbackService.name);

  constructor(private readonly supabase: SupabaseService) {}

  async findAll() {
    const { data, error } = await this.supabase
      .getClient()
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      this.logger.error('Error fetching feedback', error.message);
      throw error;
    }
    return data;
  }

  async create(dto: CreateFeedbackDto) {
    const { data, error } = await this.supabase
      .getClient()
      .from('feedback')
      .insert([{ name: dto.name, email: dto.email, message: dto.message }])
      .select();

    if (error) {
      this.logger.error('Error creating feedback', error.message);
      throw error;
    }
    return data;
  }
}
