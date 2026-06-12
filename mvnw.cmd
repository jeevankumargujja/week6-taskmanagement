@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM ----------------------------------------------------------------------------
@echo off
setlocal

set MAVEN_PROJECTBASEDIR=%~dp0

set MVNW_REPOURL=https://repo.maven.apache.org/maven2
set WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar
set WRAPPER_PROPERTIES=%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.properties

for /f "usebackq tokens=1,2 delims==" %%a in ("%WRAPPER_PROPERTIES%") do (
    if "%%a"=="distributionUrl" set DISTRIBUTION_URL=%%b
)

set MAVEN_DIST_DIR=%USERPROFILE%\.m2\wrapper\dists

if not exist "%WRAPPER_JAR%" (
    if not "%MVNW_VERBOSE%"=="" echo Downloading Maven Wrapper...
    powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $url = '%MVNW_REPOURL%/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar'; Invoke-WebRequest -Uri $url -OutFile '%WRAPPER_JAR%'}"
)

set JAVA_HOME_CANDIDATE=C:\Users\jeeva\AppData\Local\Programs\Eclipse Adoptium\jdk-17.0.18.8-hotspot
if exist "%JAVA_HOME_CANDIDATE%\bin\java.exe" set JAVA_HOME=%JAVA_HOME_CANDIDATE%

"%JAVA_HOME%\bin\java.exe" -classpath "%WRAPPER_JAR%" org.apache.maven.wrapper.MavenWrapperMain %*
