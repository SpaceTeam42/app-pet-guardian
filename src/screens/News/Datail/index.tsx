import { useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native';

import { formatDistanceToNow, parseISO, format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

import { api } from '@libs/api';

import { useQuery } from '@tanstack/react-query';

import Toast from 'react-native-toast-message';

// import { RenderMdx } from 'rn-mdx';
import Markdown from 'react-native-markdown-display';

import { INewsDTO } from 'src/dtos/news-dto';

import { Header } from '@components/Header';
import { Loading } from '@components/Loading';

import {
  DetailNewsContainer,
  DetailNewsContent,
  NewsImage,
  Title,
  WriterText,
} from './styles';

interface IDetailNewsRouteParams {
  newsId: string;
}

const DetailNewsScreen = () => {
  const route = useRoute();

  // const [news, setNews] = useState<INews>();

  const { newsId } = route.params as IDetailNewsRouteParams;

  const { data: news, isLoading: isLoadingNews } = useQuery<
    INewsDTO | undefined
  >({
    queryKey: ['detailsNews', newsId],
    queryFn: async () => {
      try {
        const response = await api.get(`/news/show/${newsId}`);

        const newsData = response.data;

        const createdAt = format(parseISO(newsData.created_at), 'yyyy-MM-dd');

        const newsFormatted = {
          ...newsData,
          since_created_at: formatDistanceToNow(new Date(createdAt), {
            addSuffix: true,
            locale: ptBR,
          }),
        } as INewsDTO;

        return newsFormatted;
      } catch {
        Toast.show({
          type: 'error',
          text2:
            'Ops! Algo ocorreu e não conseguimos encontrar nenhuma notícia',
          position: 'bottom',
        });
      }
    },
  });

  return (
    <DetailNewsContainer>
      <Header title="Notícias" />

      {isLoadingNews ? (
        <Loading />
      ) : (
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{
            // flex: 1,
            height: '100%',
          }}
          showsVerticalScrollIndicator={false}
        >
          {news && (
            <DetailNewsContent>
              <Title>{news.title}</Title>
              <WriterText>
                Por: {news.writer.name} - {news.since_created_at}
              </WriterText>

              <NewsImage source={{ uri: news.image_url }} contentFit="cover" />

              <Markdown>{news.content}</Markdown>
            </DetailNewsContent>
          )}
        </ScrollView>
      )}
    </DetailNewsContainer>
  );
};

export { DetailNewsScreen };
