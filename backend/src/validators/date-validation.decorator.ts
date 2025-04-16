import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

/**
 * 終了日が開始日より後であることを検証するデコレータ
 * @param property 比較対象となる開始日のプロパティ名
 * @param validationOptions バリデーションオプション
 */
export function IsAfterDate(property: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isAfterDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          // 両方の値が存在する場合のみ検証
          if (value && relatedValue) {
            const endDate = new Date(value);
            const startDate = new Date(relatedValue);
            return endDate > startDate;
          }

          // どちらかの値が存在しない場合は検証をスキップ
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property}は${relatedPropertyName}より後の日付である必要があります`;
        },
      },
    });
  };
}
