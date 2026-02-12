import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private client: SupabaseClient;
  private readonly logger = new Logger(SupabaseService.name);

  onModuleInit() {
    const url = process.env.SUPABASE_URL || 'https://wcgkeofwjtgqlbrjprwy.supabase.co';
    const key =
      process.env.SUPABASE_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjZ2tlb2Z3anRncWxicmpwcnd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4ODY1MjAsImV4cCI6MjA4NjQ2MjUyMH0.bkp3tZnDz9ikDM-9jsQfOnR74JMBH0J63Absvm-m0QY';

    this.client = createClient(url, key);
    this.logger.log('Supabase client initialized');
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}
