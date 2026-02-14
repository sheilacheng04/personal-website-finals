import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      message: 'Backend is working! 🎉',
      timestamp: new Date().toISOString(),
      endpoints: {
        health: '/api/health',
        feedback: '/api/feedback',
        projects: '/api/projects',
      },
    };
  }
}
