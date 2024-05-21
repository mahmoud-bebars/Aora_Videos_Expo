import { useEffect, useState } from "react";
import { Alert } from "react-native";

const useAppwrite = (fetchFn) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchFn();
      setData(response);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchFn();

  return { data, loading, refetch };
};
export default useAppwrite;