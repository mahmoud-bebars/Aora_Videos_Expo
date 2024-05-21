import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useEffect } from "react";

import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

import { searchPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";

import VideoCard from "../../components/VideoCard";
import EmptyState from "../../components/EmptyState";
import SearchInput from "../../components/SearchInput";

const Search = () => {
  const { query } = useLocalSearchParams();
  const {
    data: posts,
    refetch,
    loading,
  } = useAppwrite(() => searchPosts(query));

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 ">
            <Text className="font-pmedium text-sm  text-gray-100">
              Search Results
            </Text>
            <Text
              className="text-2xl capitalize font-psemibold
                text-white"
            >
              {query}
            </Text>
            <View className="mt-6 mb-8">
              <SearchInput initalQuery={query} />
            </View>
          </View>
        )}
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
      />
    </SafeAreaView>
  );
};

export default Search;
