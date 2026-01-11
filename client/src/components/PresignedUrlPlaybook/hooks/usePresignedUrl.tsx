import { useMutation } from "@tanstack/react-query";
async function getPresignedUrl({
  baseURL = "",
  userName = "",
  presignedType = "",
}: {
  baseURL: string;
  userName: string;
  presignedType: string;
}) {
  const res = await fetch(baseURL, {
    method: "POST",
    body: JSON.stringify({
      userName,
      presignedType,
    }),
  });
  const urls = await res.json();
  console.log(urls);

  return urls;
}

async function uploadFile({
  baseURL = "",
  userName = "",
  presignedType = "",
}: {
  baseURL: string;
  userName: string;
  presignedType: string;
}) {
  const urls = await getPresignedUrl({
    baseURL,
    presignedType,
    userName,
  });

  // for(url :urls){

  // }
}

const usePresignedUrl = () => {
  return useMutation({
    mutationFn: uploadFile,
  });
};

export default usePresignedUrl;
