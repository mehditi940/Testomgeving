using System;
using System.Collections.Generic;
using SocketIOClient;
using SocketIOClient.Newtonsoft.Json;
using UnityEngine;
using UnityEngine.Events;
using System.Threading.Tasks;

public class SocketConnector : MonoBehaviour
{

    private string connectionUrl;
    private string roomId;

   // Token for auth
    [SerializeField]
    public string AUTH_TOKEN;

    SocketIOUnity socket;

    [Header("Room Events")]
    public UnityEvent<UserBody> onUserLeft = new();
    public UnityEvent<UserBody> onUserJoined = new();


    [Header("Event handlers for commands")]
    public UnityEvent<LayerToggleBody> onLayerToggle = new();
    public UnityEvent<LayerTransparencyBody> onLayerTransparency = new();
    public UnityEvent<SelectModelBody> onSelectModel = new();
    public UnityEvent<RotateBody> onRotate = new();
    public UnityEvent<LockModelBody> onLockModel = new();
    public UnityEvent<DrawBody> onDraw = new();
    public UnityEvent<LaserBody> onLaser = new();
    public UnityEvent onReset = new();

    [Header("WEBRTC Events")]
    public UnityEvent<StartStreamBody> onStartStream = new();
    public UnityEvent<SendOfferBody> onSendOffer = new();
    public UnityEvent<SendCanidateBody> onSendCanidate = new();
    public UnityEvent<SendAnswerBody> onSendAnswer = new();


    //Room Loader
    private RoomLoader roomLoader;

    private void Awake()
    {
        DontDestroyOnLoad(this);


    }

    private async void Start()
    {
        QrCodeScanner qrCodeScanner = FindFirstObjectByType<QrCodeScanner>();

        connectionUrl = qrCodeScanner.socketURL;
        roomId = qrCodeScanner.roomId;

        // Remove when qr code scanner is implemented
        await joinRoom(connectionUrl, roomId);

        // Change to qr scanner script
        roomLoader = gameObject.GetComponent<RoomLoader>();
        roomLoader.setParameters(connectionUrl, AUTH_TOKEN);
        roomLoader.FetchData(roomId);
    }

    public async Task joinRoom(string connectionUrl, string roomId)
    {
        SetupSocket(connectionUrl, roomId);

        //Room events
        socket.OnUnityThread("userJoined", response => onUserJoined.Invoke(response.GetValue<UserBody>()));
        socket.OnUnityThread("userLeft", response => onUserLeft.Invoke(response.GetValue<UserBody>()));

        //Command events
        socket.OnUnityThread("layerToggleCommand", response => onLayerToggle.Invoke(response.GetValue<LayerToggleBody>()));
        socket.OnUnityThread("layerTransparencyCommand", response => onLayerTransparency.Invoke(response.GetValue<LayerTransparencyBody>()));
        socket.OnUnityThread("selectModelCommand", response => onSelectModel.Invoke(response.GetValue<SelectModelBody>()));
        socket.OnUnityThread("rotateCommand", response => onRotate.Invoke(response.GetValue<RotateBody>()));
        socket.OnUnityThread("lockModelCommand", response => onLockModel.Invoke(response.GetValue<LockModelBody>()));
        socket.OnUnityThread("drawCommand", response => onDraw.Invoke(response.GetValue<DrawBody>()));
        socket.OnUnityThread("laserCommand", response => onLaser.Invoke(response.GetValue<LaserBody>()));
        socket.OnUnityThread("resetCommand", response => onReset.Invoke());

        //WebRTC events
        socket.OnUnityThread("startStreamCommand", response => onStartStream.Invoke(response.GetValue<StartStreamBody>()));
        socket.OnUnityThread("sendOfferMessage", response => onSendOffer.Invoke(response.GetValue<SendOfferBody>()));
        socket.OnUnityThread("sendCanidateMessage", response => onSendCanidate.Invoke(response.GetValue<SendCanidateBody>()));
        socket.OnUnityThread("sendAnswerMessage", response => onSendAnswer.Invoke(response.GetValue<SendAnswerBody>()));

        socket.OnAnyInUnityThread((eventName, response) =>
        {
            Debug.Log(eventName);
            Debug.Log(response);
        });

        await socket.ConnectAsync();
        await socket.EmitAsync("join");
    }

    //Sets the SocketIO connection up
    private void SetupSocket(string connectionUrl, string roomId)
    {
        socket = new SocketIOUnity(connectionUrl, new SocketIOOptions
        {
            Transport = SocketIOClient.Transport.TransportProtocol.WebSocket,
            Query = new Dictionary<string, string> {
                { "roomId", roomId }
            },
            ExtraHeaders = new Dictionary<string, string>
            {
                {"authorization", $"bearer {AUTH_TOKEN}" }
            }
        });
        socket.JsonSerializer = new NewtonsoftJsonSerializer();
    }

    //Event emitters for commands
    public async Task ToggleLayer(LayerToggleBody layerToggleBody)
    {
        await socket.EmitAsync("layerToggle", layerToggleBody);
    }
    public async Task SetLayerTransparency(LayerTransparencyBody layerTransparencyBody)
    {
        await socket.EmitAsync("layerTransparency", layerTransparencyBody);
    }
    public async Task SelectModel(SelectModelBody selectModelBody)
    {
        await socket.EmitAsync("selectModel", selectModelBody);
    }
    public async Task RotateModel(RotateBody rotateBody)
    {
        await socket.EmitAsync("rotate", rotateBody);
    }
    public async Task LockModel(LockModelBody lockModelBody)
    {
        await socket.EmitAsync("lockModel", lockModelBody);
    }
    public async Task Draw(DrawBody drawBody)
    {
        await socket.EmitAsync("draw", drawBody);
    }
    public async Task Laser(LaserBody laserBody)
    {
        await socket.EmitAsync("laser", laserBody);
    }
    public async Task ResetCommand()
    {
        await socket.EmitAsync("reset");
    }
    
    //Event emitters for WebRTC
    public async Task StartStream()
    {
        await socket.EmitAsync("startStream");
    }
    public async Task SendOffer(SendOfferBody sendOfferBody)
    {
        await socket.EmitAsync("sendOffer", sendOfferBody);
    }
    public async Task SendCanidate(SendCanidateBody sendCanidateBody)
    {
        await socket.EmitAsync("sendCanidate", sendCanidateBody);
    }
    public async Task SendAnswer(SendAnswerBody sendAnswerBody)
    {
        await socket.EmitAsync("sendAnswer", sendAnswerBody);
    }

    //Disconnect the socket when the object is destroyed
    private void OnDestroy()
    {
        if (socket != null)
        {
            socket.Disconnect();
            socket.Dispose();
            socket = null;
        }
    }

    private void OnApplicationQuit()
    {
        if (socket != null)
        {
            socket.Disconnect();
            socket.Dispose();
            socket = null;
        }
    }
}
