package com.topface.hangmanfwh;

import android.app.Activity;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

public class MainActivity extends Activity {
    private WebView mWebView;
    private FacebookApi mFacebookApi;
    private View mLoginView;

    /**
     * Called when the activity is first created.
     */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        mFacebookApi = new FacebookApi(this);
        mWebView = (WebView) findViewById(R.id.webView);
        mLoginView = findViewById(R.id.loginButton);

        mLoginView.setOnClickListener(mLoginClickListener);
        if (mFacebookApi.isSessionValid()) {
            showWebView();
        }

    }

    public void showWebView() {
        Log.i(FacebookApi.TAG, "ShowWebView with token " + mFacebookApi.getToken());
        mWebView.setVisibility(View.VISIBLE);
        mLoginView.setVisibility(View.GONE);
        mWebView.getSettings().setLoadWithOverviewMode(true);
        mWebView.getSettings().setUseWideViewPort(true);
        mWebView.loadUrl(getAuthUrl(mFacebookApi.getToken()));
        //Set our webview client for override default callbacks
        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
                Toast.makeText(MainActivity.this, getString(R.string.server_error), Toast.LENGTH_LONG);
            }
        });
        mWebView.getSettings().setJavaScriptEnabled(true);
    }

    public String getAuthUrl(String token) {
        return getString(R.string.server_url) + "/auth?token=" + token;
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.main_menu, menu);
        return true;
    }

    @Override
    public boolean onMenuItemSelected(int featureId, MenuItem item) {
        if (item.getItemId() == R.id.menu_logout) {
            mWebView.loadUrl(getString(R.string.server_url) + "/logout");
            new Thread(new Runnable() {
                @Override
                public void run() {
                    mFacebookApi.logout();
                }
            });
            mWebView.setVisibility(View.GONE);
            mLoginView.setVisibility(View.VISIBLE);

        }
        return super.onMenuItemSelected(featureId, item);
    }

    private View.OnClickListener mLoginClickListener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            mFacebookApi.startAuth(new Handler() {
                @Override
                public void handleMessage(Message msg) {
                    super.handleMessage(msg);
                    showWebView();
                }
            });
        }
    };
}
