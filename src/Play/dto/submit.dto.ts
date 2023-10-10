import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class SubmitDto {
    @IsInt()
    @IsNotEmpty()
    challengeId: number;

    @IsInt()
    @IsNotEmpty()
    playlistId: number;

    @IsString()
    @IsNotEmpty()
    code: string;
}