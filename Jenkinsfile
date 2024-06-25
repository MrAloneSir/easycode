def createVersion() {
    // 定义一个版本号作为当次构建的版本，输出结果 20191210175842_69
    return new Date().format('yyyyMMddHHmmss')
}
pipeline {
  agent any
  environment {
    FE_WXURL = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1f586ad1-9c70-4688-ba53-cb6fadebb1c3'
    QA_WXURL = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=40ebfa51-6a68-4419-8460-146a02db765f'
    WXURL = "${QA_WXURL}"
    DST_HOST = ''
    DATESTR = createVersion()
  }
  stages {
    stage('install') {
      steps {
        script {
          switch(BRANCH_NAME) {
            case '13':
              DST_HOST = 'www.sit13.dom'
              WXURL = "${FE_WXURL}"
            break
            case '14':
              DST_HOST = 'www.uat14.dom'
            break
          }
           DST_DIR = "/data/apps/business/web/easycode/"
        }
        sh "npm ci"
      }
    }

    stage('build') {

      steps {
        sh "npm run build:${BRANCH_NAME}"

        // sh "docker build --build-arg BRANCH_NAME=${BRANCH_NAME} -t registry.eeo-inc.com/teacherin/easycode-web:${BRANCH_NAME}-${DATESTR} ."
        // sh "docker push registry.eeo-inc.com/teacherin/easycode-web:${BRANCH_NAME}-${DATESTR}"
      }
    }
    stage('deploy') {
     steps {
       sh "ssh -p61104 -o StrictHostKeyChecking=no jenkins@${DST_HOST} \"sudo mkdir -p ${DST_DIR};sudo chown eeoweb.eeoweb ${DST_DIR}\""
       sh "rsync -vzrtK  -e 'ssh -p61104 -o StrictHostKeyChecking=no' --rsync-path=\"sudo rsync\" ./dist/ jenkins@${DST_HOST}:${DST_DIR} --exclude=\"/.git*\""
       sh "ssh -p61104 -o StrictHostKeyChecking=no jenkins@${DST_HOST} \"sudo chown -R eeoweb.eeoweb ${DST_DIR}\""
     }
    }
  }
  post {
    success {
      sh "curl ${WXURL} -H 'Content-Type: application/json' -d '{\"msgtype\": \"text\",\"text\": {\"content\": \"'\"$BRANCH_NAME: $BUILD_URL\"'\"}}'"
    }

    failure {
      sh "curl ${WXURL} -H 'Content-Type: application/json' -d '{\"msgtype\": \"text\",\"text\": {\"content\": \"'\"$BRANCH_NAME: pipeline failure\n${BUILD_URL}console \"'\"}}'"
    }
  }
}

