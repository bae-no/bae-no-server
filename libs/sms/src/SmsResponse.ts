export class SmsResponse {
  statusCode: string;

  get isSuccessful(): boolean {
    return this.statusCode === '202';
  }
}
