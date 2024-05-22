import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";
import { getAllPosts, getLatestPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import { useGlobalContext } from "../../context/GlobalProvider";

const Home = () => {
  const { data: posts, refetch, loading } = useAppwrite(getAllPosts);

  const { data: latestPosts, refetch: refetchLatest } =
    useAppwrite(getLatestPosts);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    refetch();
    refetchLatest();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => <ListHeader latest={latestPosts} />}
        ListEmptyComponent={() => {
          return loading ? (
            <View className="w-full h-full items-center justify-center">
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <EmptyState
              title="No Videos Founded"
              subtitle="Be the First One to Upload about it"
            />
          );
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;

const ListHeader = ({ latest }) => {
  const { user } = useGlobalContext();
  return (
    <View className="my-6 px-4 space-y-6">
      <View className="justify-between items-start flex-row mb-6 ">
        <View>
          <Text className="font-pmedium text-sm  text-gray-100">
            Wlecome Back
          </Text>
          <Text
            className="text-2xl capitalize font-psemibold
                text-white"
          >
            {user?.username}
          </Text>
        </View>
        <View className="mt-1.5">
          <Image
            source={images.logoSmall}
            className="w-9 h-10 "
            resizeMeode="contain"
          />
        </View>
      </View>
      <SearchInput />
      <View className="w-full flex-1 pt-5 pb-8">
        <Text className="text-gray-100 text-lg font-pregular mb-3">
          Latest Videos
        </Text>
        <Trending posts={latest ?? []} />
      </View>
    </View>
  );
};
