import { View, Text, Image } from "react-native";
import React from "react";
import { images } from "../constants";
import { CustomButton } from "./index";
import { useRouter } from "expo-router";

const EmptyState = ({ title, subtitle }) => {
  const router = useRouter();
  return (
    <View className="justify-center items-center px-4">
      <Image
        source={images.empty}
        resizeMode="conatin"
        className="w-[270px] h-[215px]"
      />
      <Text className="font-pmedium text-sm  text-gray-100">{subtitle}</Text>
      <Text
        className="text-xl capitalize font-psemibold
                text-white"
      >
        {title}
      </Text>
      <CustomButton
        title="Create Video"
        handlePress={() => router.push("/create")}
        containerStyles="w-full my-5"
      />
    </View>
  );
};

export default EmptyState;
