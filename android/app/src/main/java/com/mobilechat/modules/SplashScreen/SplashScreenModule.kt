package com.mobilechat.modules.SplashScreen

import android.app.Activity
import android.app.Dialog
import android.os.Build
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.mobilechat.R
import java.lang.ref.WeakReference

class SplashScreenModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "SplashScreenModule"
    }

    @ReactMethod
    fun hide() {
        var currentActivity = currentActivity

        if (currentActivity == null && mainActivityRef != null) {
            currentActivity = mainActivityRef?.get()
        }

        if (currentActivity == null || splashDialog == null) {
            return
        }

        val activity = currentActivity

        activity.runOnUiThread {
            var isDestroyed = false

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
                isDestroyed = activity.isDestroyed
            }

            if (!activity.isFinishing && !isDestroyed && splashDialog != null && splashDialog!!.isShowing) {
                splashDialog?.dismiss()
            }

            splashDialog = null
        }
    }

    companion object {
        private var mainActivityRef: WeakReference<Activity>? = null
        private var splashDialog: Dialog? = null

        fun show(activity: Activity) {
            mainActivityRef = WeakReference(activity)

            activity.runOnUiThread {
                splashDialog = Dialog(activity, R.style.AppTheme_SplashDialog)
                splashDialog?.setContentView(R.layout.splash_screen)
                splashDialog?.setCancelable(false)

                if (splashDialog != null && !splashDialog!!.isShowing && !activity.isFinishing) {
                    splashDialog?.show()
                }
            }
        }
    }
}
