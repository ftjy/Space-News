import { useState } from "react";

interface ApiResponse<T> {
    articleData: T | null;
    loadingData: boolean;
    errorData: string | null;
}

type FetchFunction = (url: string) => Promise<void>;

const useFetch = <T,>(): [FetchFunction, ApiResponse<T>] => {
  const [response, setResponse] = useState<ApiResponse<T>>({
    articleData: null,
    loadingData: false,
    errorData: null,
  });

  const fetchData: FetchFunction = async (url) => {
    setResponse({ ...response, loadingData: true });
    try {
      const fetchedData = await fetch(url);
      if (!fetchedData.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await fetchedData.json();
      console.log("Fetch");
      console.log(result);
      setResponse({ articleData: result, loadingData: false, errorData: null });
    } catch (error) {
      setResponse({ ...response, loadingData: false, errorData: "An error occurred" });
    }
  };

  return [fetchData, response];
};

export default useFetch;
