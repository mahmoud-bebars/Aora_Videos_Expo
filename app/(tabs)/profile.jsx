import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { getUserPosts, signOut } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import useAppwrite from "../../lib/useAppwrite";

import { VideoCard, EmptyState, InfoBox } from "../../components";
import { icons } from "../../constants";

import { router } from "expo-router";

const Profile = () => {
  const { setIsLoggedIn, user, setUser, isLoading, setIsLoading } =
    useGlobalContext();
  const { data: posts, loading } = useAppwrite(() => getUserPosts(user.$id));
  const logout = async () => {
    setIsLoading(true);

    await signOut();
    setUser(null);
    setIsLoggedIn(false);

    setIsLoading(false);
    router.replace("/sign-in");
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="w-full justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              className="w-full items-end mb-10"
              onPress={logout}
              disabled={isLoading}
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>
            <View className="w-16 h-16 border border-secondary justify-center items-center rounded-lg">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>
            <InfoBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />
            <View className="mt-5 flex-row">
              <InfoBox
                title={
                  loading ? (
                    <View className="justify-center items-center p-1">
                      <ActivityIndicator size="small" />
                    </View>
                  ) : (
                    posts.length || 0
                  )
                }
                subtitle="Posts"
                containerStyles="mr-10 justify-center items-center"
                titleStyles="text-xl"
              />
              <InfoBox
                title={
                  loading ? (
                    <View className="justify-center items-center p-1">
                      <ActivityIndicator size="small" />
                    </View>
                  ) : (
                    "1.2k"
                  )
                }
                containerStyles="justify-center items-center"
                subtitle="Followers"
                titleStyles="text-xl"
              />
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

export default Profile;
