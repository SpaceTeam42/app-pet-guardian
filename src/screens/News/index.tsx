import { useCallback, useState } from 'react';
import { RefreshControl } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { formatDistanceToNow, parseISO, format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

import { useQuery } from '@tanstack/react-query';

import { RenderMdx } from 'rn-mdx';

import Toast from 'react-native-toast-message';

import { api } from '@libs/api';

import { useTheme } from 'styled-components/native';

import { INewsDTO } from 'src/dtos/news-dto';

import { Loading } from '@components/Loading';
import { HeaderProfileSignIn } from '@components/HeaderProfileSignIn';

import {
  NewsBox,
  NewsContainer,
  NewsContent,
  NewsImage,
  NewsInfo,
  NewsList,
  NewsText,
  NewsTitle,
  WriterText,
} from './styles';

const NewsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  // const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOnRefreshControlNewsList, setIsLoadingOnRefreshControlNews] =
    useState(false);
  // const [news, setNews] = useState<INews[]>([]);

  const { data: news, isLoading: isLoadingNews } = useQuery<
    INewsDTO[] | undefined
  >({
    queryKey: ['newsScreen'],
    queryFn: async () => {
      try {
        const response = await api.get('/news', {
          params: {
            enabled: true,
          },
        });

        const newsData: INewsDTO[] = response.data;

        const newsFormatted = newsData.map<INewsDTO>((newsItem) => {
          const createdAt = format(parseISO(newsItem.created_at), 'yyyy-MM-dd');

          return {
            ...newsItem,
            since_created_at: formatDistanceToNow(new Date(createdAt), {
              addSuffix: true,
              locale: ptBR,
            }),
          };
        });

        return newsFormatted;
      } catch {
        Toast.show({
          type: 'error',
          text2: 'Não foi possível carregar as notícias',
          position: 'bottom',
        });
      }
    },
  });

  // FUNCTIONS
  const loadNews = useCallback(async () => {
    // try {
    //   const response = await api.get('/news', {
    //     params: {
    //       enabled: true,
    //     },
    //   });
    //   if (response.status === 200) {
    //     const newsData: INews[] = response.data;
    //     const newsFormatted = newsData.map((newsItem) => {
    //       const createdAt = format(parseISO(newsItem.created_at), 'yyyy-MM-dd');
    //       return {
    //         ...newsItem,
    //         since_created_at: formatDistanceToNow(new Date(createdAt), {
    //           addSuffix: true,
    //           locale: ptBR,
    //         }),
    //       };
    //     });
    //     setNews(newsFormatted);
    //   }
    // } catch {
    //   Toast.show({
    //     type: 'error',
    //     text2: 'Não foi possível carregar as notícias',
    //     position: 'bottom',
    //   });
    // } finally {
    //   setIsLoading(false);
    // }
  }, []);

  const handleRefreshNews = useCallback(async () => {
    setIsLoadingOnRefreshControlNews(true);
    await loadNews();
    setIsLoadingOnRefreshControlNews(false);
  }, [loadNews]);

  const handleDetailNewsNavigation = useCallback(
    (newsId: string) => {
      navigation.navigate('detailNewsScreen', { newsId });
    },
    [navigation],
  );
  // END FUNCTIONS

  // useEffect(() => {
  //   setIsLoading(true);
  //   loadNews();
  // }, [loadNews]);

  return (
    <NewsContainer>
      <HeaderProfileSignIn />

      {isLoadingNews ? (
        <Loading />
      ) : (
        <NewsContent>
          <NewsList
            data={news}
            keyExtractor={(item) => item.id}
            renderItem={({ item: newsItem }) => (
              <NewsBox
                rippleColor={theme.COLORS.PINK_100}
                onPress={() => handleDetailNewsNavigation(newsItem.id)}
              >
                <NewsImage
                  source={{ uri: newsItem.image_url }}
                  resizeMode="cover"
                />

                <NewsInfo>
                  <NewsTitle>{newsItem.title}</NewsTitle>
                  <WriterText>Por: {newsItem.writer.name}</WriterText>

                  <RenderMdx components={{ NewsText }}>
                    {`
                      <NewsText numberOfLines={3} ellipsizeMode="tail" >
                        *${newsItem.description}*
                      </NewsText>
                    `}
                  </RenderMdx>
                </NewsInfo>
              </NewsBox>
            )}
            refreshControl={
              <RefreshControl
                colors={[
                  theme.COLORS['primary-color'],
                  theme.COLORS['seconde-color'],
                  theme.COLORS.PINK_200,
                ]}
                progressBackgroundColor={theme.colors['white-color']}
                refreshing={isLoadingOnRefreshControlNewsList}
                onRefresh={handleRefreshNews}
              />
            }
          />
        </NewsContent>
      )}
    </NewsContainer>
  );
};

export { NewsScreen };
