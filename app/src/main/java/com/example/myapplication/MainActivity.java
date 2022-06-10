package com.example.myapplication;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.provider.ContactsContract;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import android.view.WindowManager;

import androidx.annotation.RequiresApi;

public class MainActivity extends AppCompatActivity {
    EditText username,password;
    EditText email;
    View phone;
    Button signUpBtn;
    String regularExpr= "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!])[A-Za-z\\d@$!]{8,}$";
    String regularExpr1= "^[0-9]{10}$";
    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN)

    @SuppressLint("WrongViewCast")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE);
        setContentView(R.layout.activity_main);
        setContentView(R.layout.activity_main);
        username = findViewById(R.id.username);
        password = findViewById(R.id.password);
        phone = findViewById(R.id.phone);
        signUpBtn = findViewById(R.id.signup);
        email = findViewById(R.id.email);
        signUpBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String uname = username.getText().toString();
                String pwd = password.getText().toString();
                String email;
                ContactsContract.CommonDataKinds.Phone phone;
                if(validatePassword(pwd)){
                    Bundle bundle = new Bundle();
                    bundle.putString("username",uname);
                    bundle.putString("password",pwd);
                    Intent intent = new Intent(MainActivity.this,MainActivity2.class);
                    intent.putExtras(bundle);
                    startActivity(intent);
                }
                else{
                    Toast.makeText(MainActivity.this,"Invaild Password",
                    Toast.LENGTH_SHORT).show();
                }
                String p = null;
                if(isValidMobile(p)){
                    Bundle bundle = new Bundle();
                    bundle.putString("username",uname);
                    bundle.putString("password",pwd);
                    Intent intent = new Intent(MainActivity.this,MainActivity2.class);
                    intent.putExtras(bundle);
                    startActivity(intent);
                }
                else{
                    Toast.makeText(MainActivity.this,"Invaild Number",
                            Toast.LENGTH_SHORT).show();
                }
            }
        });
    }
    public boolean validatePassword(String pwd){
        Pattern pattern = Pattern.compile(regularExpr);
        Matcher matcher = pattern.matcher(pwd);
        return matcher.matches();

    }
    private boolean isValidMobile(String phone) {
        if(!Pattern.matches("^[0-9]{10}$", phone)) {
            return false;
        }
        return true;
    }
}
