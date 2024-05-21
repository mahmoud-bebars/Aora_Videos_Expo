import { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";

import FormField from "../../components/FormField";
import { Link, router, useRouter } from "expo-router";
import { createUser } from "../../lib/appwrite";

const SignUn = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert("Error", "Please Fill in all the feild");
    }
    setLoading(true);
    try {
      const result = await createUser(form.email, form.password, form.username);

      // set it to global state with context API...

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
            Sign Up
          </Text>
          <FormField
            title="Username"
            placeholder="Enter your Username"
            value={form.username}
            handleChangeText={(e) => {
              setForm({ ...form, username: e });
            }}
            otherStyles="mt-10"
          />
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
            title="Sign Up"
            handlePress={handleSubmit}
            containerStyles="mt-7"
            isLoading={loading}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-secondary"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default SignUn;
