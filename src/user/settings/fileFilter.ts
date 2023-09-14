import { HttpException, HttpStatus } from '@nestjs/common';

export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  const fileExtension = file.mimetype.split('/')[1];
  const validFiles = ['jpg', 'jpeg', 'png'];
  if (validFiles.some((el) => fileExtension.includes(el)))
    return callback(null, true);
  return callback(
    new HttpException(
      `${file.fieldname} is not a valid document`,
      HttpStatus.UNPROCESSABLE_ENTITY,
    ),
    false,
  );
};
