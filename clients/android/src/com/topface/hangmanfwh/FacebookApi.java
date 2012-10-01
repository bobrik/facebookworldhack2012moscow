package com.topface.hangmanfwh;

import android.app.Activity;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.widget.Toast;
import com.facebook.android.DialogError;
import com.facebook.android.Facebook;
import com.facebook.android.FacebookError;

import java.io.IOException;

public class FacebookApi {
    public static final String[] PERMISSIONS = new String[]{
            "user_about_me",
            "user_likes",
            "user_interests",
            "friends_likes",
            "friends_interests",
            "publish_actions",
            "publish_stream"
    };
    private Activity mActivity;
    private Facebook mFacebook;
    public static final String TAG = "Hangman";
    private static final int AUTH_COMPLETE = 0;

    public FacebookApi(Activity activity) {
        mActivity = activity;
        mFacebook = new Facebook(mActivity.getString(R.string.app_id));
    }

    public Boolean isSessionValid() {
        return mFacebook.isSessionValid();
    }

    public void startAuth(Handler handler) {
        mFacebook.authorize(mActivity, PERMISSIONS, getDialogListener(handler));
    }

    public boolean logout() {
        try {
            mFacebook.logout(mActivity);
            return true;
        }
        catch (IOException e) {
            Log.e(TAG, "Logout error", e);
            return false;
        }
    }

    public String getToken() {
        return mFacebook.getAccessToken();
    }

    private Facebook.DialogListener getDialogListener(final Handler handler) {
        return new Facebook.DialogListener() {
            @Override
            public void onComplete(Bundle values) {
                handler.sendEmptyMessage(AUTH_COMPLETE);
            }

            @Override
            public void onFacebookError(FacebookError e) {
                Toast.makeText(
                        mActivity,
                        String.format(
                                mActivity.getString(R.string.facebook_error),
                                e.getErrorCode(),
                                e.getErrorType(),
                                e.getMessage()
                        ),
                        Toast.LENGTH_LONG
                );
            }

            @Override
            public void onError(DialogError e) {
                Toast.makeText(
                        mActivity,
                        String.format(
                                mActivity.getString(R.string.error),
                                e.getMessage()
                        ),
                        Toast.LENGTH_LONG
                );
            }

            @Override
            public void onCancel() {
                Toast.makeText(
                        mActivity,
                        mActivity.getString(R.string.login_cancel),
                        Toast.LENGTH_LONG
                );
            }
        };
    }
}
