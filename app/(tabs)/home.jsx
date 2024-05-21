import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";
import { getAllPosts, getLatestPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";

const Home = () => {
  const { data: posts, refetch } = useAppwrite(getAllPosts);

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
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Be the First One to Upload Video"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;

const ListHeader = ({ latest }) => {
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
            mahmoud bebars
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
