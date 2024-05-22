import {
  View,
  Text,
  RefreshControl,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllPosts, getUserBookmarks } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import { EmptyState, SearchInput, VideoCard } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";

const BookmarkScreen = () => {
  const [query, setQuery] = useState("");

  const { data: posts, refetch, loading } = useAppwrite(getUserBookmarks);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    refetch();
    refetchLatest();
    setRefreshing(false);
  };

  const searchSaved = () => {
    const regex = new RegExp(query, "i");

    const results = user.videoLikes.filter((item) => regex.test(item.title));
    setPosts(results);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 ">
            <Text
              className="text-2xl capitalize font-psemibold
                text-white"
            >
              Saved Videos
            </Text>
            <View className="mt-6 mb-8">
              <View className=" border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row space-x-4">
                <TextInput
                  className="text-base mt-0.5 flex-1 text-white font-pregular"
                  value={query}
                  placeholder={"Search on your saved Videos"}
                  placeholderTextColor="#CDCDE0"
                  onChangeText={(e) => setQuery(e)}
                  onSubmitEditing={() => searchSaved()}
                />

                <TouchableOpacity onPress={searchSaved}>
                  <Image
                    className="w-5 h-5"
                    resizeMode="contain"
                    source={icons.search}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={() => {
          loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <EmptyState
              title="No Videos Saved Yet"
              subtitle="Explore Videos & save what you like here"
            />
          );
        }}
      />
    </SafeAreaView>
  );
};

export default BookmarkScreen;
