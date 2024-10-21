import { IWriterDTO } from './write-dto';

export type INewsDTO = {
  id: string;
  title: string;
  description: string;
  content: string;
  image_url: string;
  created_at: string;
  since_created_at: string;
  writer: IWriterDTO;
};
