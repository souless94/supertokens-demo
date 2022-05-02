from supertokens_python import init, InputAppInfo, SupertokensConfig
from supertokens_python.recipe import emailpassword, session
from supertokens_python import get_all_cors_headers
from fastapi import Depends, FastAPI
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
from supertokens_python.framework.fastapi import get_middleware
from supertokens_python.recipe.session.framework.fastapi import verify_session
from supertokens_python.recipe.session import SessionContainer

init(
    app_info=InputAppInfo(
        app_name="myapp",
        api_domain="http://localhost:8000",
        website_domain="http://localhost:3000",
        api_base_path="/auth",
        website_base_path="/"
    ),
    supertokens_config=SupertokensConfig(
        # try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
        connection_uri="http://localhost:3567/",
        # api_key="IF YOU HAVE AN API KEY FOR THE CORE, ADD IT HERE"
    ),
    framework='fastapi',
    recipe_list=[
        session.init(), # initializes session features
        emailpassword.init()
    ],
    mode='asgi' # use wsgi if you are running using gunicorn
)

app = FastAPI()
app.add_middleware(get_middleware())
@app.get('/api/user')
async def get_session_info(session_: SessionContainer = Depends(verify_session())):
    return JSONResponse({
        'sessionHandle': session_.get_handle(),
        'userId': session_.get_user_id(),
        'accessTokenPayload': session_.get_access_token_payload(),
    })
# TODO: Add APIs

app = CORSMiddleware(
    app=app,
    allow_origins=[
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["GET", "PUT", "POST", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Content-Type"] + get_all_cors_headers(),
)


