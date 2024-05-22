import { View, Text, Image, TouchableOpacity } from "react-native";
import { useState } from "react";
import { icons } from "../constants";
import { ResizeMode, Video } from "expo-av";
import { useGlobalContext } from "../context/GlobalProvider";
import { savePost, unSavePost } from "../lib/appwrite";

const VideoCard = ({ video }) => {
  const { user, setUser } = useGlobalContext();
  const [play, setPlay] = useState(false);

  const toggleBookmark = async () => {
    const filter = user.videoLikes.filter((like) => like.$id === video.$id);
    if (filter.length > 0 && filter[0].$id === video.$id) {
      const newLikes = user.videoLikes.filter((item) => item.$id === video.$id);
      setUser({ ...user, videoLikes: newLikes });
      await unSavePost(video, user?.$id);
    } else {
      console.log("New Like");
      setUser({ ...user, videoLikes: [...user.videoLikes, video] });
      await savePost(video, user?.$id);
    }
    console.log(filter);
  };

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: video.creator.avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1 ">
            <Text
              className="text-white font-psemibold text-sm "
              numberOfLines={1}
            >
              {video.title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {video.creator.username}
            </Text>
          </View>
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={toggleBookmark}>
          <View className="pt-2">
            <Image
              source={icons.bookmark}
              className="w-5 h-5"
              tintColor={
                user.videoLikes.filter((likes) => likes.$id === video.$id)
                  .length > 0
                  ? "#FFA002"
                  : "#CDCDE0"
              }
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
        <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>

      {play ? (
        <>
          <Video
            source={{ uri: video.video }}
            className="w-full h-60 rounded-xl mt-3 relative justify-center bg-white/10"
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            shouldPlay
            onPlaybackStatusUpdate={(status) => {
              if (status.didJustFinish) {
                setPlay(false);
              }
            }}
          />
        </>
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
        >
          <Image
            source={{ uri: video.thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
