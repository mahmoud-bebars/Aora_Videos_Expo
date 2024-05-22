import { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";

import { StatusBar } from "expo-status-bar";

import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";

import { getCurrentUser, signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

import { images } from "../../constants";

import { CustomButton, FormField } from "../../components";

const SignIn = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please Fill in all the feild");
    }
    setLoading(true);
    try {
      await signIn(form.email, form.password);

      const currentUser = await getCurrentUser();

      setUser(currentUser);
      setIsLoggedIn(true);

      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image
            source={images.logo}
            className="w-[115px] h-[35px]"
            resizeMode="contain"
          />
          <Text className="text-xl mt-10 text-white text-semibold font-psemibold">
            Sign in
          </Text>
          <FormField
            title="Email"
            placeholder="Enter your Email Address"
            value={form.email}
            handleChangeText={(e) => {
              setForm({ ...form, email: e });
            }}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            placeholder="Type in your Password"
            value={form.password}
            handleChangeText={(e) => {
              setForm({ ...form, password: e });
            }}
            otherStyles="mt-7"
            keyboardType="password"
          />
          <CustomButton
            title="Log In"
            handlePress={handleSubmit}
            containerStyles="mt-7"
            isLoading={loading}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Dont't Have account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-secondary"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default SignIn;
