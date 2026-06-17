# Fix JVM Crash / OutOfMemoryError during Android Build

## Problem
- JVM crash log: `hs_err_pid22052.log` (and many others)
- Error: `There is insufficient memory for the Java Runtime Environment to continue`
- System: 5GB RAM, Windows 11
- Current JVM args: `-Xmx2048m -XX:MaxMetaspaceSize=512m`
- New Architecture is enabled (`newArchEnabled=true`)

## Root Cause
Building React Native Android with New Architecture requires significant memory. With only 5GB RAM and JVM heap set to 2GB, the system runs out of memory during the R8/DEX compilation phase (evidenced by `com.android.tools.r8.dex.C::a` in the crash log).

## Plan
1. **Edit `android/gradle.properties`**
   - Reduce `org.gradle.jvmargs` from `-Xmx2048m` to `-Xmx1536m` (or lower)
   - Add `-XX:MaxRAMPercentage=70.0` to let JVM auto-manage within available RAM
   - Disable `org.gradle.parallel` to reduce concurrent memory pressure
   - Add `org.gradle.daemon=false` to prevent Gradle daemon from holding memory
   - Add `org.gradle.workers.max=2` to limit parallel workers

2. **(Optional but recommended) Disable New Architecture** if not required
   - Set `newArchEnabled=false` in `android/gradle.properties` (saves significant build memory)
   - Or set `"newArchEnabled": false` in `app.json`

3. **Clean build caches**
   - Delete `android/build`
   - Delete `android/app/build`
   - Delete `.gradle` caches

4. **Build with limited resources**
   - Use `npx expo run:android --no-build-cache` or with `--max-workers 1`

## Follow-up Steps
- Test build after changes
- Monitor system memory usage during build
- If still failing, further reduce `-Xmx` to `1024m` and disable Hermes if needed

