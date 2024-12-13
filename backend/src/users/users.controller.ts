import { Body, Controller, Post } from '@nestjs/common';
import { userData } from './dto/user.dto';

@Controller('users')
export class UsersController {
  @Post('login')
  login(@Body() userData: userData) {
    console.log(userData);
  }

  @Post('register')
  register(@Body() userData: userData) {
    console.log(userData);
  }
}
