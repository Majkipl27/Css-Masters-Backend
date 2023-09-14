import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class SettingsDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastname?: string;

  @IsOptional()
  x?: string;

  @IsOptional()
  instagram?: string;

  @IsOptional()
  github?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  description?: string;
}
