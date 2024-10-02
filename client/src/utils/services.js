export const baseUrl = 'https://teamsconnect.onrender.com/api'


export const filebaseUrl = 'https://teamsconnect.onrender.com'

export const postRequest = async (url, body) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  const data = await response.json();

  if (!response.ok) {
    let message;

    if (data?.message) {
      message = data.message;
    } else {
      message = data;
    }

    return { error: true, message };
  }

  return data;
};

export const getRequest = async (url) => {
  const response = await fetch(url);

  const data = await response.json();

  if (!response.ok) {
    let message = "An error occured...";

    if (data?.message) {
      message = data.message;
    }

    return { error: true, message };
  }
  return data;
};

export const sendOffer = async (roomId, offer) => {
  return await postRequest(
    `/api/room/${roomId}/offer`,
    JSON.stringify({ offer })
  );
};

export const sendAnswer = async (roomId, answer) => {
  return await postRequest(
    `/api/room/${roomId}/answer`,
    JSON.stringify({ answer })
  );
};

export const sendIceCandidate = async (roomId, candidate) => {
  return await postRequest(
    `/api/room/${roomId}/ice-candidate`,
    JSON.stringify({ candidate })
  );
};
