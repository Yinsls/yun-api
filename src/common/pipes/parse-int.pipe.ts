import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      const val = parseInt(value, 10);
      if (isNaN(val)) {
        throw new BadRequestException(
          `Validation failed. "${val}" is not an integer`,
        );
      }
      return val;
    }
    return value;
  }
}
